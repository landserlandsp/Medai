package com.medai.app.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.medai.app.databinding.FragmentEcgBinding

class EcgFragment : Fragment() {
    private var _binding: FragmentEcgBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentEcgBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.header.text = "ECG Assistant"
        binding.status.text = "Статус: прототип, без клинического диагноза"
        binding.summary.text = "Изображение будет проверяться локально. Результат не является диагнозом."
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
